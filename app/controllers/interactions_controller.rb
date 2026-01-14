class InteractionsController < ApplicationController
  before_action :set_lead
  before_action :set_interaction, only: [:show, :update, :destroy]

  def index
    render json: @lead.interactions.recent.map { |i| interaction_response(i) }
  end

  def show
    render json: interaction_response(@interaction)
  end

  def create
    interaction = @lead.interactions.build(interaction_params)
    if interaction.save
      render json: interaction_response(interaction), status: :created
    else
      render json: { errors: interaction.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @interaction.update(interaction_params)
      render json: interaction_response(@interaction)
    else
      render json: { errors: @interaction.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @interaction.destroy
    head :no_content
  end

  private

  def set_lead
    @lead = current_user.leads.find(params[:lead_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Lead not found' }, status: :not_found
  end

  def set_interaction
    @interaction = @lead.interactions.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Interaction not found' }, status: :not_found
  end

  def interaction_params
    params.permit(:interaction_type, :notes, :interaction_date)
  end

  def interaction_response(interaction)
    {
      id: interaction.id,
      lead_id: interaction.lead_id,
      interaction_type: interaction.interaction_type,
      notes: interaction.notes,
      interaction_date: interaction.interaction_date,
      created_at: interaction.created_at
    }
  end
end
