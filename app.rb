HTTPClient = Faraday.new(url: 'http://query.yahooapis.com/v1/public/yql') do |builder|
  builder.use Faraday::Adapter::EMSynchrony

  builder.use Faraday::Response::Yajl
  builder.use Faraday::Response::Mashify
end

configure do
  set :root, File.dirname(__FILE__)
  mime_type :manifest, 'text/cache-manifest'
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

  currencies = params[:currencies].split(',')
  currency_list = currencies.inject("") {|o,c| o << "'" + c + "USD'," }[0...-1]
  
  response = HTTPClient.get { |request|
    request.params.merge!({
      q: "select * from yahoo.finance.xchange where pair in (#{currency_list})",
      env: "http://datatables.org/alltables.env",
      format: "json"
    })
  }.body

  response['query']['results']['rate'].inject({}) do |hash, exchange|
    hash.merge(exchange["id"][0..2] => exchange["Rate"].to_f)
  end.to_json
end

get '/offline.manifest' do
  content_type :manifest
  erb :"offline.manifest", layout: false
end