import React, { useState } from 'react';
import { Button, Form, FormGroup, Input, Label, Row, Col, Card, CardBody } from 'reactstrap';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const FAQSection = ({ value = [], onChange }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempQuestion, setTempQuestion] = useState('');
  const [tempAnswer, setTempAnswer] = useState('');

  const handleAddFAQ = () => {
    if (tempQuestion.trim() && tempAnswer.trim()) {
      const newFAQ = {
        question: tempQuestion.trim(),
        answer: tempAnswer.trim()
      };
      
      const updatedFAQs = [...(value || []), newFAQ];
      onChange(updatedFAQs);
      
      // Reset form
      setTempQuestion('');
      setTempAnswer('');
    }
  };

  const handleEditFAQ = (index) => {
    const faq = value[index];
    setEditingIndex(index);
    setTempQuestion(faq.question);
    setTempAnswer(faq.answer);
  };

  const handleUpdateFAQ = () => {
    if (tempQuestion.trim() && tempAnswer.trim() && editingIndex !== null) {
      const updatedFAQs = [...value];
      updatedFAQs[editingIndex] = {
        question: tempQuestion.trim(),
        answer: tempAnswer.trim()
      };
      
      onChange(updatedFAQs);
      
      // Reset form
      setEditingIndex(null);
      setTempQuestion('');
      setTempAnswer('');
    }
  };

  const handleDeleteFAQ = (index) => {
    const updatedFAQs = value.filter((_, i) => i !== index);
    onChange(updatedFAQs);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setTempQuestion('');
    setTempAnswer('');
  };

  return (
    <div className="faq-section">
      <h5 className="mb-3">FAQ Section</h5>
      
      {/* Add/Edit FAQ Form */}
      <Card className="mb-3">
        <CardBody>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label>Question *</Label>
                <Input
                  type="text"
                  value={tempQuestion}
                  onChange={(e) => setTempQuestion(e.target.value)}
                  placeholder="Enter FAQ question..."
                  className="mb-2"
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label>Answer *</Label>
                <Input
                  type="textarea"
                  value={tempAnswer}
                  onChange={(e) => setTempAnswer(e.target.value)}
                  placeholder="Enter FAQ answer..."
                  rows="3"
                  className="mb-2"
                />
              </FormGroup>
            </Col>
          </Row>
          
          <div className="d-flex gap-2">
            {editingIndex !== null ? (
              <>
                <Button
                  color="primary"
                  size="sm"
                  onClick={handleUpdateFAQ}
                  disabled={!tempQuestion.trim() || !tempAnswer.trim()}
                >
                  <FaEdit className="me-1" />
                  Update FAQ
                </Button>
                <Button
                  color="secondary"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                color="success"
                size="sm"
                onClick={handleAddFAQ}
                disabled={!tempQuestion.trim() || !tempAnswer.trim()}
              >
                <FaPlus className="me-1" />
                Add FAQ
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Existing FAQs List */}
      {value && value.length > 0 && (
        <div className="existing-faqs">
          <h6 className="mb-2">Existing FAQs ({value.length})</h6>
          {value.map((faq, index) => (
            <Card key={index} className="mb-2">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">
                      <strong>Q{index + 1}:</strong> {faq.question}
                    </h6>
                    <p className="mb-0 text-muted">
                      <strong>A:</strong> {faq.answer}
                    </p>
                  </div>
                  <div className="d-flex gap-1">
                    <Button
                      color="info"
                      size="sm"
                      onClick={() => handleEditFAQ(index)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteFAQ(index)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {(!value || value.length === 0) && (
        <div className="text-muted text-center py-3">
          No FAQs added yet. Add your first FAQ above.
        </div>
      )}
    </div>
  );
};

export default FAQSection;
