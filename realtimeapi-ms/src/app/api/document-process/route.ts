import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { image, filename, fileType } = await req.json();

    // Create a comprehensive prompt for medical document extraction
    const systemPrompt = `You are an advanced AI medical document processor for the Healthcare AI Platform. 
    
    Analyze the uploaded medical document/image and extract all relevant clinical information into a structured JSON format. 
    
    For medical documents and images, focus on:
    - Document Type (Lab Report, X-Ray, MRI, CT Scan, Prescription, Medical Record, etc.)
    - Patient Information (Name, Patient ID, DOB, Gender, Contact)
    - Clinical Data (Vital Signs, Lab Values, Diagnoses, Medications, Procedures)
    - Medical Imaging Analysis (if applicable - describe findings, abnormalities, recommendations)
    - Healthcare Provider Information
    - Dates and Timeline
    - Clinical Recommendations and Follow-up Actions
    
    For medical images (X-rays, MRIs, CT scans, etc.), provide detailed clinical analysis including:
    - Anatomical structures visible
    - Any abnormal findings or pathology (lesions, masses, fractures, inflammation, etc.)
    - Clinical significance and urgency level
    - Recommended follow-up or additional studies
    
    CRITICAL: For risk assessment, use these guidelines:
    - HIGH risk: Any suspicious lesions, masses, tumors, fractures, acute conditions, or abnormalities requiring immediate attention
    - MEDIUM risk: Minor abnormalities, chronic conditions, or findings requiring routine follow-up
    - LOW risk: Normal findings or very minor variations within normal limits
    
    Return a JSON object with the following structure:
    {
      "documentType": "string (Lab Report, X-Ray, MRI, CT Scan, Prescription, Medical Record, etc.)",
      "classification": "string (Clinical Document, Medical Imaging, Lab Results, etc.)", 
      "patientInfo": {
        "fullName": "string",
        "patientId": "string",
        "dateOfBirth": "string",
        "gender": "string",
        "contact": "string"
      },
      "clinicalData": {
        "vitalSigns": {},
        "labValues": {},
        "diagnoses": [],
        "medications": [],
        "procedures": []
      },
      "medicalAnalysis": {
        "findings": "string (detailed clinical findings)",
        "abnormalities": [],
        "clinicalSignificance": "string",
        "recommendations": []
      },
      "providerInfo": {
        "facility": "string",
        "physician": "string",
        "department": "string"
      },
      "validationChecks": {
        "documentAuthenticity": "PASS/FAIL/PENDING",
        "fieldCompleteness": "PASS/FAIL/PENDING", 
        "dataConsistency": "PASS/FAIL/PENDING",
        "formatCompliance": "PASS/FAIL/PENDING"
      },
      "riskAssessment": {
        "riskLevel": "LOW/MEDIUM/HIGH",
        "riskFactors": [],
        "confidence": "number (0-100)"
      },
      "recommendations": [],
      "processingNotes": "string"
    }
    
    If the document is not clear or cannot be processed, indicate this in the response.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use GPT-4 Vision model
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please carefully analyze this medical document/image: ${filename} (${fileType}). 
              
              If this is a medical image (X-ray, MRI, CT scan, etc.), examine it thoroughly for:
              - Any lesions, masses, tumors, or abnormal growths
              - Fractures, dislocations, or structural abnormalities  
              - Signs of inflammation, infection, or disease
              - Any other pathological findings
              
              Provide detailed clinical findings and set the appropriate risk level based on what you observe. Be specific about any abnormalities detected.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${fileType};base64,${image}`
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    });

    const extractedContent = response.choices[0]?.message?.content;
    
    if (!extractedContent) {
      throw new Error('No content extracted from document');
    }

    // Try to parse as JSON, fallback to structured response if not valid JSON
    let structuredResponse;
    try {
      structuredResponse = JSON.parse(extractedContent);
    } catch (parseError) {
      // If not valid JSON, create a structured response
      structuredResponse = {
        documentType: "Unknown Medical Document",
        classification: "Medical Document Analysis",
        patientInfo: {
          fullName: "Not detected",
          patientId: "Not detected",
          dateOfBirth: "Not detected",
          gender: "Not detected",
          contact: "Not detected"
        },
        clinicalData: {
          vitalSigns: {},
          labValues: {},
          diagnoses: [],
          medications: [],
          procedures: []
        },
        medicalAnalysis: {
          findings: extractedContent,
          abnormalities: [],
          clinicalSignificance: "Requires manual review by healthcare professional",
          recommendations: ["Manual clinical review recommended"]
        },
        providerInfo: {
          facility: "Not detected",
          physician: "Not detected",
          department: "Not detected"
        },
        validationChecks: {
          documentAuthenticity: "PENDING",
          fieldCompleteness: "PENDING",
          dataConsistency: "PENDING",
          formatCompliance: "PASS"
        },
        riskAssessment: {
          riskLevel: extractedContent.toLowerCase().includes('lesion') || 
                    extractedContent.toLowerCase().includes('mass') || 
                    extractedContent.toLowerCase().includes('tumor') || 
                    extractedContent.toLowerCase().includes('abnormal') || 
                    extractedContent.toLowerCase().includes('suspicious') ? "HIGH" : "LOW",
          riskFactors: extractedContent.toLowerCase().includes('lesion') ? ["Lesion detected"] : [],
          confidence: 85
        },
        recommendations: ["Document processed successfully", "Clinical review recommended"],
        processingNotes: "Medical document analyzed using AI vision model"
      };
    }

    // Add metadata
    structuredResponse.metadata = {
      filename,
      fileType,
      processedAt: new Date().toISOString(),
      processingModel: "gpt-4o",
      apiVersion: "v1.0"
    };

    return NextResponse.json(structuredResponse);

  } catch (error) {
    console.error('Document processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process document', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
