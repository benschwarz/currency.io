require 'sinatra'
require 'peach'
require 'rack/client'
require 'rack/cache'
require 'json'
require 'yajl'

HTTPClient = Rack::Client.new do
  use Rack::Cache,
    :metastore   => 'heap://',
    :entitystore => 'heap://'
    
  run Rack::Client::Handler::NetHTTP
end

configure do
  mime_type :manifest, "text/cache-manifest"
end

get '/' do
  erb :index
end

post '/exchange' do
  content_type :json

  currencies = {}
  params[:currencies].split(',').peach { |currency|
    request = HTTPClient.get("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D'http%3A%2F%2Fwww.google.com%2Fig%2Fcalculator%3Fq%3D#{currency}%2520USD'&format=json").body

    currencies[currency] = ::Yajl::Parser.parse(request)['query']['results']['json']['rhs'].to_f
  }
  
  ::Yajl::Encoder.encode currencies
end

get '/offline.manifest' do
  content_type :manifest
  erb :"offline.manifest", :layout => false
end