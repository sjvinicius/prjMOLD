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

function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(
            Buffer.from(
                token.split(".")[1],
                "base64url"
            ).toString()
        );

        if (!payload.exp) {
            return true;
        }

        return payload.exp * 1000 <= Date.now();
    } catch {
        return true;
    }
}

export function proxy(request: NextRequest) {

    const path = request.nextUrl.pathname
    const publicroute = publicroutes.find(route => path === route.path)
    const authtoken = request.cookies
        .getAll()
        .find(cookie =>
            cookie.name.startsWith("sb-") &&
            cookie.name.endsWith("-auth-token")
        );

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
        const token = authtoken.value;

        if (isTokenExpired(token)) {
            const response = NextResponse.redirect(
                new URL(
                    REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE,
                    request.url
                )
            );

            response.cookies.delete(authtoken.name);

            const redirecturl = request.nextUrl.clone()
            redirecturl.pathname = "/signin"

            return NextResponse.redirect(redirecturl)
        }
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
        '/((?!api|_next/static|_next/image|favicon.ico|about_.*\\.jpg|base_.*\\.png|plant_.*\\.png|logo_.*\\.png|fundo_.*\\.jpg|checkout|fundo_.*\\.png).*)',
    ]
}