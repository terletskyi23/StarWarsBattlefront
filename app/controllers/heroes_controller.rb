# app/controller/heroes_controller.rb
class HeroesController < ApplicationController
  include Tubesock::Hijack

  def battlefield
    hijack do |tubesock|
      # Listen on its own thread
      redis_thread = Thread.new do
        # Needs its own redis connection to pub
        # and sub at the same time
        Redis.new.subscribe "move" do |on| # <-- Redis sub
          on.message do |channel, message|
            tubesock.send_data message
          end
        end
      end

      tubesock.onopen do
        # pub the message when we get one
        # note: this echoes through the sub above
        Redis.new.publish "move", JSON[Hero.create(x: rand(810 - 60), y: rand(410 - 65), name: Faker::Name.name).attributes]
      end

      tubesock.onmessage do |data|
        params = JSON[data]
        hero = Hero.find(params.delete('id'))
        hero.update_attributes(params)
        Redis.new.publish "move", JSON[hero.attributes] # <-- Redis pub
      end
    end
  end
end
