HTTPClient = Rack::Client.new do
  use Rack::Cache,
    :metastore   => 'heap://',
    :entitystore => 'heap://'
  
  use Rack::Client::Parser
  run Rack::Client::Handler::NetHTTP
end

YQL_BASE = "http://query.yahooapis.com/v1/public/yql"

configure do
  set :root, File.dirname(__FILE__)
  mime_type :manifest, "text/cache-manifest"
end

before do
  content_type :html, charset: 'utf-8'
end

get '/', agent: /(iPhone|iPod|webOS|Android)/ do
  erb :app
end

get '/' do
  erb :site, layout: false
end

post '/exchange' do
  content_type :json

  # This is all pretty awful, but we do it to keep the client side code simple.
  currencies = params[:currencies].split(',')
  currency_list = currencies.inject("") {|o,c| o << "'" + c + "USD'," }[0...-1]
  
  request = HTTPClient.get(YQL_BASE, {}, {
    format: "json",
    q: "select * from yahoo.finance.xchange where pair in (#{currency_list})",
    env: "http://datatables.org/alltables.env"}).body
  
  # These days, I'd probably use faraday with faraday-stack to handle the
  # HTTP requests and automagically parse the JSON being returned. 
  ::Yajl::Parser.parse(request)['query']['results']['rate'].inject({}) do |hash, exchange|
    hash.merge(exchange["id"][0..2] => exchange["Rate"].to_f)
  end.to_json
end

get '/offline.appcache' do
  content_type :manifest
  erb :"offline.appcache", layout: false
end