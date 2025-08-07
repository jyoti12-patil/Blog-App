import { ConnectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import { NextResponse } from "next/server";

// Connect to database
const LoadDB = async () => {
    await ConnectDB();
};
LoadDB();

// Handle email subscription (POST)
export async function POST(request) {
    try {
        const body = await request.json(); // Read JSON request
        const emailData = {
            email: body.email,
        };

        await EmailModel.create(emailData);
        return NextResponse.json({ success: true, msg: "Email Subscribed" });
    } catch (error) {
        return NextResponse.json({ success: false, msg: "Error saving email" }, { status: 500 });
    }
}

// Get all subscribed emails (GET)
export async function GET() {
    try {
        const emails = await EmailModel.find({});
        return NextResponse.json({ emails });
    } catch (error) {
        return NextResponse.json({ success: false, msg: "Error fetching emails" }, { status: 500 });
    }
}

// Delete an email subscription (DELETE)
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url); // Extract query params
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, msg: "Missing email ID" }, { status: 400 });
        }

        await EmailModel.findByIdAndDelete(id);
        return NextResponse.json({ success: true, msg: "Email Deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, msg: "Error deleting email" }, { status: 500 });
    }
}
