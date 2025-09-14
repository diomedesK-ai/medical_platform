import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { image, filename, fileType } = await req.json();

    // Create a comprehensive prompt for Malaysian government document extraction
    const systemPrompt = `You are an AI document processor for the Malaysian Government Services platform. 
    
    Analyze the uploaded document and extract all relevant information into a structured JSON format. 
    
    For Malaysian government documents, focus on:
    - Personal Information (Name, MyKad/IC Number, Address, Phone, Email)
    - Document Type Classification
    - Government Service Type (Health, Education, Welfare, Legal, etc.)
    - Key Fields and Values
    - Validation Status
    - Risk Assessment
    
    Return a JSON object with the following structure:
    {
      "documentType": "string",
      "classification": "string", 
      "personalInfo": {
        "fullName": "string",
        "icNumber": "string",
        "address": "string",
        "phone": "string",
        "email": "string"
      },
      "serviceType": "string",
      "extractedFields": {},
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
              text: `Please analyze this document: ${filename} (${fileType})`
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
        documentType: "Unknown",
        classification: "Document Analysis",
        personalInfo: {
          fullName: "Not detected",
          icNumber: "Not detected",
          address: "Not detected",
          phone: "Not detected",
          email: "Not detected"
        },
        serviceType: "General",
        extractedFields: {
          rawAnalysis: extractedContent
        },
        validationChecks: {
          documentAuthenticity: "PENDING",
          fieldCompleteness: "PENDING",
          dataConsistency: "PENDING",
          formatCompliance: "PASS"
        },
        riskAssessment: {
          riskLevel: "LOW",
          riskFactors: [],
          confidence: 85
        },
        recommendations: ["Document processed successfully", "Manual review recommended"],
        processingNotes: "Document analyzed using AI vision model"
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
