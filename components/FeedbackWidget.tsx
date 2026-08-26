'use client';

import React, { useState } from 'react';
import { buildFeedbackMailto, FeedbackType } from '../lib/utils/feedback';

const FEEDBACK_TYPES: FeedbackType[] = ['Suggest an improvement', 'Report a problem', 'General feedback'];

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('General feedback');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSend = () => {
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const mailtoUrl = buildFeedbackMailto({
      type: feedbackType,
      message,
      email,
      pageUrl,
    });

    try {
      window.location.href = mailtoUrl;
    } catch (e) {
      console.error('Failed to open mail client for feedback', e);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          color: '#94a3b8',
          fontSize: '12px',
          textDecoration: 'underline',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Feedback
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-modal-title"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              padding: '24px',
              maxWidth: '480px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h2 id="feedback-modal-title" style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                Help us improve CargoScale
              </h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close feedback dialog"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  lineHeight: 1,
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label htmlFor="feedback-type" style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Feedback Type
              </label>
              <select
                id="feedback-type"
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', background: '#fff' }}
              >
                {FEEDBACK_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label htmlFor="feedback-message" style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Your Feedback
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think..."
                rows={4}
                style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="feedback-email" style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Your email (optional)
              </label>
              <input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={closeModal}
                style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
