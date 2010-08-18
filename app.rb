require 'rest-client'

configure do
  mime_type :manifest, "text/cache-manifest"
end

get '/' do
  erb :index
end

get '/exchange' do
  content_type :json
  RestClient.get("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D'http%3A%2F%2Fwww.google.com%2Fig%2Fcalculator%3Fq%3D#{params[:from]}%2520#{params[:to]}'&format=json").to_s  
end

get '/offline.manifest' do
  content_type :manifest
  erb :"offline.manifest"
end