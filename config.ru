require 'rubygems'
require 'bundler'
Bundler.setup

require 'sinatra'

$LOAD_PATH << File.dirname(__FILE__)
require 'app'


use Rack::ETag
run Sinatra::Application