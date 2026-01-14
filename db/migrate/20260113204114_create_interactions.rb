class CreateInteractions < ActiveRecord::Migration[8.1]
  def change
    create_table :interactions do |t|
      t.references :lead, null: false, foreign_key: true
      t.string :interaction_type
      t.text :notes
      t.datetime :interaction_date

      t.timestamps
    end
  end
end
