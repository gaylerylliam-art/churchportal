(function () {
  const config = window.CYA_SUPABASE_CONFIG || {};

  function isConfigured() {
    return Boolean(config.url && config.anonKey);
  }

  async function request(path, options = {}) {
    if (!isConfigured()) {
      return { ok: false, skipped: true, message: "Supabase is not configured." };
    }

    const response = await fetch(`${config.url.replace(/\/$/, "")}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Supabase request failed with ${response.status}`);
    }

    if (response.status === 204) return null;
    return response.json();
  }

  async function insert(table, record) {
    return request(table, {
      method: "POST",
      body: JSON.stringify(record),
    });
  }

  async function update(table, id, patch) {
    return request(`${table}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  }

  async function list(table) {
    return request(`${table}?select=*`);
  }

  window.churchBackend = {
    isConfigured,
    list,
    insertActivity(activity) {
      return insert("activities", mapActivity(activity));
    },
    insertExpense(expense) {
      return insert("expenses", mapExpense(expense));
    },
    insertFundRelease(release) {
      return insert("fund_releases", {
        id: release.id,
        activity_id: release.activityId,
        released_amount: release.amount,
        release_date: release.date,
        released_to: release.releasedTo,
        payment_method: release.method,
        reference_number: release.reference,
        remarks: release.remarks,
      });
    },
    insertLiquidationReport(report) {
      return insert("liquidation_reports", {
        id: report.id,
        activity_id: report.activityId,
        summary: report.summary,
        attendees: report.attendees,
        amount_returned: report.amountReturned,
        issues: report.issues,
        recommendations: report.recommendations,
        status: report.status,
        submitted_by: report.submittedBy,
        submitted_date: report.submittedDate,
      });
    },
    insertAuditLog(entry) {
      return insert("audit_logs", {
        id: entry.id,
        user_name: entry.user,
        role_name: entry.role,
        action: entry.action,
        related_record: entry.record,
        previous_value: entry.previous,
        new_value: entry.next,
        occurred_at: new Date(entry.date).toISOString(),
      });
    },
    updateExpenseStatus(id, status) {
      return update("expenses", id, { status });
    },
  };

  function mapActivity(activity) {
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      category: activity.category,
      ministry: activity.ministry,
      district: activity.district,
      leader_name: activity.leader,
      start_date: activity.start,
      end_date: activity.end,
      venue: activity.venue,
      expected_participants: activity.participants,
      status: activity.status,
      budget_status: activity.budgetStatus,
      report_status: activity.reportStatus,
      funding_source: activity.fundingSource,
      proposed_budget: activity.proposedBudget,
      approved_budget: activity.approvedBudget,
      actual_expense: activity.actualExpense,
      line_items: activity.lineItems,
    };
  }

  function mapExpense(expense) {
    return {
      id: expense.id,
      activity_id: expense.activityId,
      category: expense.category,
      vendor: expense.vendor,
      invoice_no: expense.invoiceNo,
      invoice_date: expense.date,
      amount: expense.amount,
      tax: expense.tax,
      description: expense.description,
      payment_method: expense.paymentMethod,
      paid_by: expense.paidBy,
      remarks: expense.remarks,
      status: expense.status,
      attachment_label: expense.attachment,
      extracted: expense.extracted,
    };
  }
})();
