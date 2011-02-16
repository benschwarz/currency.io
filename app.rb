require 'sinatra'
require 'rack/client'
require 'rack/cache'
require 'yajl'
require 'json'

HTTPClient = Rack::Client.new do
  use Rack::Cache,
    :metastore   => 'heap://',
    :entitystore => 'heap://'
  
  use Rack::Client::Parser
  run Rack::Client::Handler::NetHTTP
end

YQL_BASE = "http://query.yahooapis.com/v1/public/yql"

configure { mime_type :manifest, "text/cache-manifest" }

get '/', agent: /(iPhone|iPod)/ do
  erb :app
end

get '/' do
  erb :site, layout: false
end

post '/exchange' do
  content_type :json

  currencies = params[:currencies].split(',')
  currency_list = currencies.inject("") {|o,c| o << "'" + c + "USD'," }[0...-1]
  
  request = HTTPClient.get(YQL_BASE, {}, {
    format: "json",
    q: "select * from yahoo.finance.xchange where pair in (#{currency_list})",
    env: "http://datatables.org/alltables.env"}).body
  
  ::Yajl::Parser.parse(request)['query']['results']['rate'].inject({}) do |hash, exchange|
    hash.merge(exchange["id"][0..2] => exchange["Rate"].to_f)
  end.to_json
end

get '/offline.manifest' do
  content_type :manifest
  erb :"offline.manifest", layout: false
end