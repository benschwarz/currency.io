require 'rubygems'
require 'bundler'
Bundler.setup

require File.dirname(__FILE__) + '/app'

use Rack::ETag
run Sinatra::Application