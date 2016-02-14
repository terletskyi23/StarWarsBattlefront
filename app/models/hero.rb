# == Schema Information
#
# Table name: heros
#
#  id    :integer          not null, primary key
#  name  :string
#  y     :integer
#  x     :integer
#  image :integer
#

class Hero < ActiveRecord::Base
  before_create :_add_random_image

  private

  def _add_random_image
    self.image = rand(9)
  end
end
