import React from 'react'
import { useTranslation } from "react-i18next"
import './WorkflowTimeline.css'

function WorkflowTimeline({ logs }) {
    const [t] = useTranslation()

    const getStatusColor = (status) => {
        switch (status) {
            case 'hired':
                return 'success'
            case 'interview_scheduled':
                return 'warning'
            case 'rejected':
                return 'danger'
            default:
                return 'secondary'
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    }

    return (
        <div className="workflow-timeline">
            {logs && logs.length > 0 ? (
                logs.map((log, index) => (
                    <div key={index} className="timeline-item">
                        <div className="timeline-badge">
                            <i className={`fas fa-circle text-${getStatusColor(log.new_state)}`}></i>
                        </div>
                        <div className="timeline-panel">
                            <div className="timeline-heading">
                                <h4 className="timeline-title">
                                    {t('Status changed to')} {t(log.new_state)}
                                </h4>
                                <p>
                                    <small className="text-muted">
                                        <i className="fas fa-clock"></i> {formatDate(log.created_at)}
                                    </small>
                                </p>
                            </div>
                            <div className="timeline-body">
                                <p className="mb-0">
                                    {t('Changed from')} <span className={`badge bg-${getStatusColor(log.previous_state)}`}>
                                        {t(log.previous_state)}
                                    </span> {t('to')} <span className={`badge bg-${getStatusColor(log.new_state)}`}>
                                        {t(log.new_state)}
                                    </span>
                                </p>
                                {log.notes && (
                                    <p className="mt-2 mb-0">
                                        <strong>{t('Notes')}:</strong> {log.notes}
                                    </p>
                                )}
                                {log.changed_by && (
                                    <p className="mt-2 mb-0">
                                        <strong>{t('Changed by')}:</strong> {log.changed_by}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-muted">{t('No workflow history available')}</p>
            )}
        </div>
    )
}

export default WorkflowTimeline
