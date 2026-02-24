import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Resume } from '@/types';

// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        paddingBottom: 40,
        fontFamily: 'Helvetica',
    },
    header: {
        backgroundColor: '#f5e6e8',
        paddingHorizontal: 48,
        paddingVertical: 32,
        textAlign: 'center',
        marginBottom: 20,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    contactInfo: {
        fontSize: 10,
        color: '#374151', // text-gray-700
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 5,
    },
    section: {
        marginHorizontal: 48,
        marginBottom: 20,
    },
    sectionTitleBox: {
        backgroundColor: '#f5e6e8',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    summaryText: {
        fontSize: 10,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    skillItem: {
        fontSize: 10,
        marginHorizontal: 4,
    },
    experienceItem: {
        marginBottom: 12,
    },
    experienceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        alignItems: 'baseline',
    },
    experienceTitle: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    experienceDate: {
        fontSize: 10,
        fontStyle: 'italic',
    },
    bulletList: {
        marginLeft: 16,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    bulletPoint: {
        width: 10,
        fontSize: 10,
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
        textAlign: 'justify',
        lineHeight: 1.4,
    },
    educationItem: {
        marginBottom: 8,
    },
    educationSchool: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    educationDegree: {
        fontSize: 10,
    },
    educationDate: {
        fontSize: 10,
        fontStyle: 'italic',
        marginTop: 2,
    },
});

interface PdfProps {
    resume: Resume;
}

export const ExecutiveRosePdf = ({ resume }: PdfProps) => {
    const { personalInfo, summary, experience, education, skills, certifications } = resume;

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
                        {personalInfo.phone && <Text> | {personalInfo.phone}</Text>}
                        {personalInfo.location && <Text> | {personalInfo.location}</Text>}
                        {personalInfo.linkedIn && <Text> | {personalInfo.linkedIn}</Text>}
                    </View>
                </View>

                {/* Summary */}
                {summary && (
                    <View style={styles.section}>
                        <View style={styles.sectionTitleBox}>
                            <Text style={styles.sectionTitle}>SUMMARY</Text>
                        </View>
                        <Text style={styles.summaryText}>{summary}</Text>
                    </View>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionTitleBox}>
                            <Text style={styles.sectionTitle}>AREAS OF EXPERTISE</Text>
                        </View>
                        <View style={styles.skillsContainer}>
                            {skills.map((skill, index) => (
                                <Text key={skill.id} style={styles.skillItem}>
                                    {skill.name}
                                    {index < skills.length - 1 ? ' • ' : ''}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionTitleBox}>
                            <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
                        </View>
                        {experience.map((exp) => (
                            <View key={exp.id} style={styles.experienceItem}>
                                <View style={styles.experienceHeader}>
                                    <Text style={styles.experienceTitle}>
                                        {exp.position} | {exp.company}
                                    </Text>
                                    <Text style={styles.experienceDate}>
                                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                    </Text>
                                </View>
                                <View style={styles.bulletList}>
                                    {exp.achievements.map((achievement, idx) => (
                                        <View key={idx} style={styles.bulletItem}>
                                            <Text style={styles.bulletPoint}>•</Text>
                                            <Text style={styles.bulletText}>{achievement}</Text>
                                        </View>
                                    ))}
                                    {exp.description && (
                                        <View style={styles.bulletItem}>
                                            <Text style={styles.bulletPoint}>•</Text>
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
                        <View style={styles.sectionTitleBox}>
                            <Text style={styles.sectionTitle}>EDUCATION</Text>
                        </View>
                        {education.map((edu) => (
                            <View key={edu.id} style={styles.educationItem}>
                                <View style={styles.experienceHeader}>
                                    <Text style={styles.educationSchool}>{edu.institution}</Text>
                                    <Text style={styles.educationDate}>
                                        {edu.startDate} – {edu.endDate}
                                    </Text>
                                </View>
                                <Text style={styles.educationDegree}>
                                    {edu.degree} in {edu.field}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionTitleBox}>
                            <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
                        </View>
                        {certifications.map((cert) => (
                            <View key={cert.id} style={styles.educationItem}>
                                <View style={styles.experienceHeader}>
                                    <Text style={styles.educationSchool}>{cert.name}</Text>
                                    <Text style={styles.educationDate}>
                                        {cert.date} {cert.expiry ? `– ${cert.expiry}` : ''}
                                    </Text>
                                </View>
                                <Text style={styles.educationDegree}>{cert.issuer}</Text>
                            </View>
                        ))}
                    </View>
                )}

            </Page>
        </Document>
    );
};
