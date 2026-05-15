const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

interface FirebaseUser {
  uid: string
  email?: string
}

export async function verifyToken(token: string): Promise<FirebaseUser | null> {
  if (!FIREBASE_API_KEY) {
    console.error("FIREBASE_API_KEY not configured")
    return null
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      },
    )

    if (!response.ok) {
      console.error("Token verification failed:", response.status)
      return null
    }

    const data = await response.json()
    const user = data.users?.[0]
    if (!user) return null

    return {
      uid: user.localId,
      email: user.email,
    }
  } catch (error) {
    console.error("Failed to verify Firebase token:", error)
    return null
  }
}
