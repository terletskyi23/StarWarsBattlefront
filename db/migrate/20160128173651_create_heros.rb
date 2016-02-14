class CreateHeros < ActiveRecord::Migration
  def change
    create_table :heros do |t|
      t.string :name
      t.integer :y
      t.integer :x
    end
  end
end
