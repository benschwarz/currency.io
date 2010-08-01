require 'rubygems'
require 'bundler'
Bundler.setup

require 'sinatra'
require 'sass/plugin/rack'

$:<< File.dirname(__FILE__)
require 'app'

use Sass::Plugin::Rack
run Sinatra::Application