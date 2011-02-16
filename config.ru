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

case ENV['RACK_ENV']
  when "development"
    cache_store = :disk
  when "production"
    cache_store = {memcached: "#{ENV['MEMCACHE_USERNAME']}:#{ENV['MEMCACHE_PASSWORD']}@#{ENV['MEMCACHE_SERVERS']}"}
end

# use Rack::PageSpeed, public: Sinatra::Application.public do
#   store disk: "/tmp"
#   
#   inline_javascripts max_size: 4000
#   inline_css
#   combine_javascripts
# end

run Sinatra::Application
