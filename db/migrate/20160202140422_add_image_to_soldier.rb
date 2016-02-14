class AddImageToSoldier < ActiveRecord::Migration
  def change
    add_column :heros, :image, :integer # <-- This is the method, that adds new column into table.
  end
end
