import { NextRequest, NextResponse, ProxyConfig } from "next/server";

const publicroutes = [
    {
        path: "/",
        whenauthenticated: "next"
    },
    {
        path: "/_next/image",
        whenauthenticated: "next"
    },
    {
        path: "/signin",
        whenauthenticated: "redirect"
    },
    {
        path: "/register",
        whenauthenticated: "redirect"
    },
    {
        path: "/products",
        whenauthenticated: "next"
    },
    {
        path: "/about",
        whenauthenticated: "next"
    },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/signin'

export function proxy(request: NextRequest) {

    const path = request.nextUrl.pathname
    const publicroute = publicroutes.find(route => path === route.path)
    const authtoken = request.cookies.get("mold@accesstoken")

    if (!authtoken && publicroute) {
        return NextResponse.next()
    }

    if (!authtoken && !publicroute) {
        const redirecturl = request.nextUrl.clone()
        redirecturl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

        return NextResponse.redirect(redirecturl)
    }

    if (authtoken && publicroute && publicroute.whenauthenticated == "redirect") {

        const redirecturl = request.nextUrl.clone()
        redirecturl.pathname = "/"

        return NextResponse.redirect(redirecturl)
    }

    if (authtoken && !publicroute) {

        // Checar Expiração
        // Remover Cookie e redirecionar pra login
    }

    return NextResponse.next()
}

export const config: ProxyConfig = {

    matcher: [
        /*
             * Match all request paths except for the ones starting with:
             * - api (API routes)
             * - _next/static (static files)
             * - _next/image (image optimization files)
             * - favicon.ico (favicon file)
             */
        '/((?!api|_next/static|_next/image|favicon.ico|about_.*\\.jpg|base_.*\\.png|plant_.*\\.png|logo_.*\\.png|checkout).*)',
    ]
}