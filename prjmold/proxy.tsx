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
    {
        path: "/robots.txt",
        whenauthenticated: "next"
    },
    {
        path: "/sitemap.xml",
        whenauthenticated: "next"
    },
    {
        path: "/google31024aee37681a96.html",
        whenauthenticated: "next"
    },
] as const;

const notpublicroutes = [
    "/orders",
    "/manage/orders",
    "/checkout",
    "/checkout/success",
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/signin'

// function isTokenExpired(token: string): boolean {
//     try {
//         const payload = JSON.parse(
//             Buffer.from(
//                 token.split(".")[1],
//                 "base64url"
//             ).toString()
//         );

//         if (!payload.exp) {
//             return true;
//         }

//         return payload.exp * 1000 <= Date.now();
//     } catch {
//         return true;
//     }
// }

export function proxy(request: NextRequest) {

    const path = request.nextUrl.pathname
    const publicroute = publicroutes.find(route => path === route.path)
    const isnotpublicroutes = notpublicroutes.find(route => path === route)

    if (!isnotpublicroutes && !publicroute) {
        const redirecturl = request.nextUrl.clone()
        redirecturl.pathname = "/not-found"

        return NextResponse.redirect(redirecturl)
    }

    const authcookie = request.cookies
        .getAll()
        .find(cookie =>
            cookie.name.startsWith("sb-") &&
            cookie.name.endsWith("-auth-token")
        );

    if (!authcookie && publicroute) {
        return NextResponse.next()
    }

    if (!authcookie && !publicroute) {
        const redirecturl = request.nextUrl.clone()
        redirecturl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

        return NextResponse.redirect(redirecturl)
    }

    if (authcookie && publicroute && publicroute.whenauthenticated == "redirect") {

        const redirecturl = request.nextUrl.clone()
        redirecturl.pathname = "/"

        return NextResponse.redirect(redirecturl)
    }

    if (authcookie && !publicroute) {
        const token = authcookie.value;

        if (!token) {
            const response = NextResponse.redirect(
                new URL(
                    REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE,
                    request.url
                )
            );

            response.cookies.delete(authcookie.name);

            return response
        }

        // if (isTokenExpired(token)) {
        //     const response = NextResponse.redirect(
        //         new URL(
        //             REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE,
        //             request.url
        //         )
        //     );

        //     response.cookies.delete(authcookie.name);

        //     return response
        // }
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
        '/((?!api|not-found|_next/static|_next/image|favicon.ico|loading|about_.*\\.jpg|base_.*\\.png|plant_.*\\.png|logo_.*\\.png|fundo_.*\\.jpg|fundo_.*\\.png).*)',
    ]
}