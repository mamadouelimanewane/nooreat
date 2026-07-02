import { NextRequest, NextResponse } from "next/server"
import { sendPushNotification } from "@/lib/onesignal"

export async function POST(req: NextRequest) {
  try {
    const { title, message, segments, playerIds, data } = await req.json()

    const appId = process.env.ONESIGNAL_APP_ID
    const restApiKey = process.env.ONESIGNAL_REST_API_KEY

    if (!appId || !restApiKey) {
      return NextResponse.json(
        { error: "OneSignal non configuré. Ajoutez ONESIGNAL_APP_ID et ONESIGNAL_REST_API_KEY dans .env.local" },
        { status: 503 }
      )
    }

    if (!title || !message) {
      return NextResponse.json({ error: "title et message sont requis" }, { status: 400 })
    }

    const result = await sendPushNotification({
      appId,
      restApiKey,
      title,
      message,
      segments,
      playerIds,
      data,
    })

    return NextResponse.json({ success: true, id: result.id, recipients: result.recipients })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
