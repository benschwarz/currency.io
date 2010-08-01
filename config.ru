require 'rubygems'
require 'bundler'
Bundler.setup

require 'sinatra'
require 'sass/plugin/rack'

require 'app'

use Sass::Plugin::Rack
run Sinatra::Application