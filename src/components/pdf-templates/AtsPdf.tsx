import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Resume } from '@/types';

// ATS-Friendly Styles
// - Simple fonts (Helvetica is standard)
// - High contrast (Black/White)
// - No background boxes
// - Clear hierarchy
// - Single column mainly
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
    color: '#000000',
  },
  contactInfo: {
    fontSize: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 8,
    paddingBottom: 2,
    letterSpacing: 1,
  },
  content: {
    fontSize: 10,
  },
  // Experience specific
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  jobTitle: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  companyName: {
    fontStyle: 'italic',
  },
  dateLocation: {
    fontSize: 10,
    textAlign: 'right',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 10,
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
  },
  // Skills
  skillList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillItem: {
    fontSize: 10,
  },
});

interface PdfProps {
  resume: Resume;
}

export const AtsPdf = ({ resume }: PdfProps) => {
  const { personalInfo, summary, experience, education, skills, certifications, customSections } = resume;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo.firstName} {personalInfo.lastName}
          </Text>
          <Text style={styles.title}>{personalInfo.title}</Text>
          <View style={styles.contactInfo}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
            {personalInfo.location && <Text>{personalInfo.location}</Text>}
            {personalInfo.linkedIn && <Text>{personalInfo.linkedIn}</Text>}
          </View>
        </View>

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.content}>{summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 10 }}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>
                    {exp.position} - {exp.company}
                  </Text>
                  <Text style={styles.dateLocation}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <View>
                  {exp.achievements.map((achievement, idx) => (
                    <View key={idx} style={styles.bulletPoint}>
                      <Text style={styles.bullet}>-</Text>
                      <Text style={styles.bulletText}>{achievement}</Text>
                    </View>
                  ))}
                  {exp.description && (
                    <View style={styles.bulletPoint}>
                      <Text style={styles.bullet}>-</Text>
                      <Text style={styles.bulletText}>{exp.description}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 8 }}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{edu.institution}</Text>
                  <Text style={styles.dateLocation}>
                    {edu.startDate} - {edu.endDate}
                  </Text>
                </View>
                <Text style={styles.content}>
                  {edu.degree} in {edu.field}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillList}>
              <Text style={styles.content}>
                {skills.map(s => s.name).join(' | ')}
              </Text>
            </View>
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={{ marginBottom: 4 }}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{cert.name}</Text>
                  <Text style={styles.dateLocation}>
                    {cert.date} {cert.expiry ? `- ${cert.expiry}` : ''}
                  </Text>
                </View>
                <Text style={styles.content}>{cert.issuer}</Text>
              </View>
            ))}
          </View>
        )}
        {/* Custom Sections */}
        {customSections.length > 0 && (
          <View style={styles.section}>
            {customSections.map((section) => (
              <View key={section.id} style={{ marginBottom: 12 }}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.items.map((item, idx) => (
                  <View key={idx} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>-</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
