class DashboardController < ApplicationController
  def stats
    leads = current_user.leads
    tasks = current_user.tasks

    render json: {
      total_leads: leads.count,
      leads_by_status: Lead::STATUSES.each_with_object({}) { |s, h| h[s] = leads.by_status(s).count },
      total_value: leads.sum(:estimated_value) || 0,
      won_value: leads.by_status('won').sum(:estimated_value) || 0,
      tasks_pending: tasks.pending.count,
      tasks_overdue: tasks.overdue.count,
      tasks_completed_this_week: tasks.completed.where('updated_at >= ?', 1.week.ago).count,
      recent_interactions: recent_interactions_count
    }
  end

  private

  def recent_interactions_count
    current_user.leads.joins(:interactions)
      .where('interactions.interaction_date >= ?', 1.week.ago)
      .distinct.count
  end
end
