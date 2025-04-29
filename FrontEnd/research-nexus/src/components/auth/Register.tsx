import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import './Auth.css';

const researchAreas = [
  'Artificial Intelligence',
  'Data Science',
  'Machine Learning',
  'Natural Language Processing',
  'Computer Vision',
  'Bioinformatics',
  'Environmental Science',
  'Physics',
  'Chemistry',
  'Mathematics',
  'Social Sciences',
  'Psychology',
  'Economics',
  'Medicine',
  'Other'
];

const academicRoles = [
  'Diploma',
  'Bachelor',
  'Advanced Diploma',
  'Honours',
  'Masters',
  'PhD'
];

const Register: React.FC = () => {
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [researchArea, setResearchArea] = useState('');
  const [otherResearchArea, setOtherResearchArea] = useState('');
  const [academicRole, setAcademicRole] = useState('');
  const [researchExperience, setResearchExperience] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!role) errors.role = 'Role is required.';
    if (!department) errors.department = 'Department is required.';
    if (!academicRole) errors.academicRole = 'Academic role is required.';
    if (!researchExperience) errors.researchExperience = 'Research experience is required.';
    
    if (role === 'Researcher') {
      if (!researchArea) errors.researchArea = 'Research area is required.';
      if (researchArea === 'Other' && !otherResearchArea) errors.otherResearchArea = 'Please specify your research area.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGoogleSignup = () => {
    if (!validateForm()) return;
    window.location.href = `${process.env.FRONTEND_URL}/auth/google`;
  };

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={5}>
            <div className="text-center mb-4">
              <h1 className="brand-name">ResearchBridge</h1>
              <p className="brand-tagline">Connect. Collaborate. Innovate.</p>
            </div>

            <Card className="shadow auth-card">
              <Card.Body className="p-4">
                <h2 className="text-center mb-4">Join ResearchBridge</h2>
                <p className="text-center text-muted mb-4">
                  Create an account to start collaborating with researchers worldwide
                </p>

                {/* Role */}
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Select your role</option>
                    <option value="Researcher">Researcher</option>
                    <option value="Reviewer">Reviewer</option>
                  </Form.Select>
                  {formErrors.role && <small className="text-danger">{formErrors.role}</small>}
                </Form.Group>

                {/* Animate extra fields */}
                <AnimatePresence>
                  {role && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Department */}
                      <Form.Group className="mb-3">
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your department"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                        />
                        {formErrors.department && <small className="text-danger">{formErrors.department}</small>}
                      </Form.Group>

                      {/* Researcher-only fields */}
                      {role === 'Researcher' && (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Label>Research Area</Form.Label>
                            <Form.Select
                              value={researchArea}
                              onChange={(e) => setResearchArea(e.target.value)}
                            >
                              <option value="">Select your research area</option>
                              {researchAreas.map((area) => (
                                <option key={area} value={area}>{area}</option>
                              ))}
                            </Form.Select>
                            {formErrors.researchArea && <small className="text-danger">{formErrors.researchArea}</small>}
                          </Form.Group>

                          {researchArea === 'Other' && (
                            <Form.Group className="mb-3">
                              <Form.Label>Other Research Area</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Specify your research area"
                                value={otherResearchArea}
                                onChange={(e) => setOtherResearchArea(e.target.value)}
                              />
                              {formErrors.otherResearchArea && <small className="text-danger">{formErrors.otherResearchArea}</small>}
                            </Form.Group>
                          )}
                        </>
                      )}

                      {/* Academic Role */}
                      <Form.Group className="mb-3">
                        <Form.Label>Current Academic Role</Form.Label>
                        <Form.Select
                          value={academicRole}
                          onChange={(e) => setAcademicRole(e.target.value)}
                        >
                          <option value="">Select your academic role</option>
                          {academicRoles.map((roleOption) => (
                            <option key={roleOption} value={roleOption}>{roleOption}</option>
                          ))}
                        </Form.Select>
                        {formErrors.academicRole && <small className="text-danger">{formErrors.academicRole}</small>}
                      </Form.Group>

                      {/* Research Experience */}
                      <Form.Group className="mb-4">
                        <Form.Label>Research Experience</Form.Label>
                        <Form.Select
                          value={researchExperience}
                          onChange={(e) => setResearchExperience(e.target.value)}
                        >
                          <option value="">Select your research experience</option>
                          {academicRoles.map((exp) => (
                            <option key={exp} value={exp}>{exp}</option>
                          ))}
                        </Form.Select>
                        {formErrors.researchExperience && <small className="text-danger">{formErrors.researchExperience}</small>}
                      </Form.Group>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button 
                  variant="outline-dark"
                  className="w-100 google-btn py-2 mb-3"
                  onClick={handleGoogleSignup}
                >
                  <FcGoogle size={20} className="me-2" />
                  <span>Sign up with Google</span>
                </Button>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary text-decoration-none">
                      Log in
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-4 text-muted small">
              <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
