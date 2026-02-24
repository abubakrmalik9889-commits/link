import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Resume name is required'],
            default: 'Untitled Resume',
        },
        templateId: {
            type: String,
            default: 'modern-slate',
        },
        personalInfo: {
            firstName: String,
            lastName: String,
            email: String,
            phone: String,
            location: String,
            title: String,
            profileImage: String,
        },
        summary: String,
        experience: [
            {
                id: String,
                jobTitle: String,
                company: String,
                startDate: String,
                endDate: String,
                isCurrent: Boolean,
                description: String,
            },
        ],
        education: [
            {
                id: String,
                school: String,
                field: String,
                degreeType: String,
                startDate: String,
                endDate: String,
                description: String,
            },
        ],
        skills: [
            {
                id: String,
                name: String,
                level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
            },
        ],
        projects: [
            {
                id: String,
                name: String,
                description: String,
                link: String,
                startDate: String,
                endDate: String,
            },
        ],
        certifications: [
            {
                id: String,
                name: String,
                issuer: String,
                date: String,
                link: String,
            },
        ],
        languages: [
            {
                id: String,
                name: String,
                proficiency: { type: String, enum: ['Basic', 'Intermediate', 'Fluent', 'Native'] },
            },
        ],
        pdfUrl: String,
        shareableLink: {
            type: String,
            unique: true,
            sparse: true,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
)

// Generate unique shareable link
resumeSchema.pre('save', async function (next) {
    if (!this.shareableLink && this.isPublic) {
        this.shareableLink = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }
    next()
})

export const Resume = mongoose.model('Resume', resumeSchema)
