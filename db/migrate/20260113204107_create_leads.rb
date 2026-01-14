class CreateLeads < ActiveRecord::Migration[8.1]
  def change
    create_table :leads do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.string :email
      t.string :company
      t.string :status
      t.text :notes
      t.string :phone
      t.string :website
      t.decimal :estimated_value

      t.timestamps
    end
    add_index :leads, :status
  end
end
