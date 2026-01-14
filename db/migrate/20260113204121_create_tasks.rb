class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.references :user, null: false, foreign_key: true
      t.references :lead, null: false, foreign_key: true
      t.string :title
      t.text :description
      t.datetime :due_date
      t.boolean :completed
      t.string :priority

      t.timestamps
    end
  end
end
