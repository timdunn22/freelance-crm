class LeadsController < ApplicationController
  before_action :set_lead, only: [:show, :update, :destroy, :update_status]

  def index
    leads = current_user.leads.includes(:tags, :interactions)
    leads = leads.by_status(params[:status]) if params[:status].present?
    render json: leads.map { |lead| lead_response(lead) }
  end

  def show
    render json: lead_response(@lead, include_details: true)
  end

  def create
    lead = current_user.leads.build(lead_params)
    if lead.save
      update_tags(lead) if params[:tag_ids].present?
      render json: lead_response(lead), status: :created
    else
      render json: { errors: lead.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @lead.update(lead_params)
      update_tags(@lead) if params.key?(:tag_ids)
      render json: lead_response(@lead)
    else
      render json: { errors: @lead.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @lead.destroy
    head :no_content
  end

  def update_status
    if @lead.update(status: params[:status])
      render json: lead_response(@lead)
    else
      render json: { errors: @lead.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def kanban
    leads_by_status = Lead::STATUSES.each_with_object({}) do |status, hash|
      hash[status] = current_user.leads.by_status(status).includes(:tags).map { |lead| lead_response(lead) }
    end
    render json: leads_by_status
  end

  private

  def set_lead
    @lead = current_user.leads.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Lead not found' }, status: :not_found
  end

  def lead_params
    params.permit(:name, :email, :company, :status, :notes, :phone, :website, :estimated_value)
  end

  def update_tags(lead)
    tag_ids = params[:tag_ids].is_a?(Array) ? params[:tag_ids] : []
    lead.tag_ids = tag_ids.select { |id| current_user.tags.exists?(id) }
  end

  def lead_response(lead, include_details: false)
    response = {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      company: lead.company,
      status: lead.status || 'new',
      phone: lead.phone,
      website: lead.website,
      estimated_value: lead.estimated_value,
      tags: lead.tags.map { |t| { id: t.id, name: t.name, color: t.color } },
      total_interactions: lead.total_interactions,
      last_interaction_date: lead.last_interaction_date,
      created_at: lead.created_at
    }
    if include_details
      response[:notes] = lead.notes
      response[:interactions] = lead.interactions.recent.map { |i| interaction_response(i) }
      response[:tasks] = lead.tasks.map { |t| task_response(t) }
    end
    response
  end

  def interaction_response(interaction)
    {
      id: interaction.id,
      interaction_type: interaction.interaction_type,
      notes: interaction.notes,
      interaction_date: interaction.interaction_date
    }
  end

  def task_response(task)
    {
      id: task.id,
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      completed: task.completed,
      priority: task.priority
    }
  end
end
