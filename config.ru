require 'rubygems'
require 'bundler'
Bundler.setup

require ::File.dirname(__FILE__) + '/app'

use Rack::ContentLength   # Set Content-Length on string bodies
use Rack::ETag            # Set E-Tags on string bodies
use Rack::ConditionalGet  # If-Modified-Since
use Rack::Deflater        # Compress HTML using deflate / gzip
use Rack::Head            # Head requests must return an empty body

run Sinatra::Application