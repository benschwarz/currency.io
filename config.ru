require 'rubygems'
require 'bundler'
Bundler.setup

require ::File.dirname(__FILE__) + '/app'
require 'rack/pagespeed'

use Rack::ContentLength   # Set Content-Length on string bodies
use Rack::ETag            # Set E-Tags on string bodies
use Rack::ConditionalGet  # If-Modified-Since
use Rack::Deflater        # Compress HTML using deflate / gzip
use Rack::Head            # Head requests must return an empty body

use Rack::PageSpeed, :public => "./public" do
  case ENV['RACK_ENV']
    when "development"
      store {}
    when "production"
      memcached_server = ENV['MEMCACHE_USERNAME'] + ":" + ENV['MEMCACHE_PASSWORD'] + "@" + ENV['MEMCACHE_SERVERS'].join
      store memcached: memcached_server
  end
  
  inline_javascripts max_size: 4000
  inline_css
  combine_javascripts
end

run Sinatra::Application