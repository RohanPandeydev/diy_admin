import React, { useState } from 'react';
import { Button, FormGroup, Input, Label, Card, CardBody, Badge } from 'reactstrap';
import { FaPlus, FaTimes } from 'react-icons/fa';

const EntitiesKeywords = ({ value = [], onChange }) => {
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !value.includes(newKeyword.trim())) {
      const updatedKeywords = [...value, newKeyword.trim()];
      onChange(updatedKeywords);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index) => {
    const updatedKeywords = value.filter((_, i) => i !== index);
    onChange(updatedKeywords);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div className="entities-keywords">
      <h5 className="mb-3">Entities & Keywords</h5>
      
      <Card className="mb-3">
        <CardBody>
          <FormGroup>
            <Label>Add Key Concept</Label>
            <div className="d-flex gap-2">
              <Input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter key concept for AI extraction..."
                className="flex-grow-1"
              />
              <Button
                color="success"
                size="sm"
                onClick={handleAddKeyword}
                disabled={!newKeyword.trim() || value.includes(newKeyword.trim())}
              >
                <FaPlus />
              </Button>
            </div>
            <small className="text-muted">
              Press Enter or click Add to include key concepts that AI should extract from this content.
            </small>
          </FormGroup>
        </CardBody>
      </Card>

      {/* Existing Keywords */}
      {value && value.length > 0 && (
        <div className="existing-keywords">
          <h6 className="mb-2">Key Concepts ({value.length})</h6>
          <div className="d-flex flex-wrap gap-2">
            {value.map((keyword, index) => (
              <Badge
                key={index}
                color="primary"
                className="d-flex align-items-center gap-1"
                style={{ fontSize: '0.9rem', padding: '0.5rem 0.75rem' }}
              >
                {keyword}
                <Button
                  color="link"
                  size="sm"
                  className="p-0 text-white"
                  onClick={() => handleRemoveKeyword(index)}
                  style={{ minWidth: 'auto', padding: '0', marginLeft: '0.25rem' }}
                >
                  <FaTimes size={12} />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {(!value || value.length === 0) && (
        <div className="text-muted text-center py-3">
          No key concepts added yet. Add concepts that AI should extract from this content.
        </div>
      )}
    </div>
  );
};

export default EntitiesKeywords;
