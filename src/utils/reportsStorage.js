import { reportsAPI } from '../services/api';

export const reportsStorage = {
  // Get all reports for a user
  async getReports(userId) {
    try {
      console.log('🔍 Getting reports for userId:', userId);
      const reports = await reportsAPI.getReports(userId);
      console.log('📊 Reports received from API:', reports);
      console.log('📊 Reports count:', Array.isArray(reports) ? reports.length : 'Not an array');
      return Array.isArray(reports) ? reports : [];
    } catch (error) {
      console.error('❌ Error getting reports:', error);
      return [];
    }
  },

  // Save a new report
  async saveReport(report) {
    try {
      const newReport = {
        ...report,
        id: report.id || Date.now().toString(),
        timestamp: report.timestamp || new Date().toISOString(),
        status: report.status || 'pending'
      };
      
      console.log('💾 Saving report with userId:', newReport.userId);
      console.log('💾 Report data:', newReport);
      const savedReport = await reportsAPI.createReport(newReport);
      console.log('✅ Report saved successfully:', savedReport);
      return savedReport;
    } catch (error) {
      console.error('❌ Error saving report:', error);
      throw error;
    }
  },


  // Update an existing report
  async updateReport(reportId, updates) {
    try {
      const updatedReport = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      return await reportsAPI.updateReport(reportId, updatedReport);
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  },

  // Delete a report (soft delete by default)
  async deleteReport(reportId, permanent = false) {
    try {
      await reportsAPI.deleteReport(reportId, permanent);
      return true;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  },

  // Get all reports (internal method)
  async getAllReports() {
    try {
      const reports = await reportsAPI.getReports();
      return Array.isArray(reports) ? reports : [];
    } catch (error) {
      console.error('Error getting all reports:', error);
      return [];
    }
  },

  // Clear all reports (for testing/debugging)
  async clearAllReports() {
    try {
      // This would need a specific API endpoint to clear all reports
      console.warn('Clear all reports not implemented for MongoDB API');
      return true;
    } catch (error) {
      console.error('Error clearing reports:', error);
      throw error;
    }
  },

  // Get reports count for a user
  async getReportsCount(userId) {
    try {
      const reports = await this.getReports(userId);
      return reports.length;
    } catch (error) {
      console.error('Error getting reports count:', error);
      return 0;
    }
  },

  // Get reports by status
  async getReportsByStatus(userId, status) {
    try {
      const reports = await reportsAPI.getReportsByStatus(userId, status);
      return Array.isArray(reports) ? reports : [];
    } catch (error) {
      console.error('Error getting reports by status:', error);
      return [];
    }
  },

  // Get deleted reports - MongoDB handles soft deletes differently
  async getDeletedReports(userId) {
    try {
      const reports = await reportsAPI.getDeletedReports(userId);
      return Array.isArray(reports) ? reports : [];
    } catch (error) {
      console.error('Error getting deleted reports:', error);
      return [];
    }
  },

  // Save deleted report - MongoDB handles soft deletes differently
  async saveDeletedReport(report) {
    try {
      // In MongoDB, we soft delete by updating status to 'deleted'
      await reportsAPI.deleteReport(report.id, false); // false = soft delete
      return true;
    } catch (error) {
      console.error('Error saving deleted report:', error);
      throw error;
    }
  },

  // Clear all deleted reports
  async clearDeletedReports(userId) {
    try {
      await reportsAPI.emptyTrash(userId);
      return true;
    } catch (error) {
      console.error('Error clearing deleted reports:', error);
      throw error;
    }
  },

  // Remove specific deleted report (when restored)
  async removeDeletedReport(reportId) {
    try {
      // Restore by updating status back to active
      await reportsAPI.restoreReport(reportId);
      return true;
    } catch (error) {
      console.error('Error removing deleted report:', error);
      throw error;
    }
  },

  // Restore a deleted report (alias for compatibility)
  async restoreReport(report) {
    try {
      return await reportsAPI.restoreReport(report.id);
    } catch (error) {
      console.error('Error restoring report:', error);
      throw error;
    }
  }
};
