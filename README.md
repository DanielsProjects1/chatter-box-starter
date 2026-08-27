# ChatterBox

ChatterBox is a multi-tenant, embeddable commenting platform built as a
privacy-conscious alternative to hosted discussion systems such as
Disqus. Site owners can add isolated discussion communities to their
websites while ChatterBox handles identity, authorization, comments,
moderation, and site administration.

## Why ChatterBox

A commenting widget looks simple on the surface, but a production SaaS
has to solve much more than storing text. ChatterBox was built around
those deeper backend problems:

-   **Multi-tenant isolation** so each registered site has its own
    members, content, roles, and moderation state.
-   **Tenant-scoped authorization** rather than treating a user's global
    identity as their permissions everywhere.
-   **OIDC authentication** backed by Keycloak and Spring Security.
-   **Embeddable delivery** through a lightweight JavaScript widget
    isolated from host-page CSS with Shadow DOM.
-   **Moderation workflows** including reports, muting, pinning,
    locking, and role-based actions.
-   **Performance engineering** across authentication and request paths.

## Architecture

``` text
Host Website
    |
    | ChatterBox embed script
    v
ChatterBox Widget (JavaScript + Shadow DOM)
    |
    | HTTPS / REST
    v
ChatterBox API (Java + Spring Boot)
    |
    +-------------------+-------------------+
    |                   |                   |
PostgreSQL            Redis              Keycloak
Application data      Caching            OIDC identity
```

ChatterBox separates **global identity** from **site-specific
authorization**. A user can have one ChatterBox identity while holding
different roles on different registered sites.

### Core domain

-   `User` --- global ChatterBox identity associated with the
    authenticated user.
-   `Site` --- a tenant representing a website registered with
    ChatterBox.
-   `SiteMember` --- connects a user to a site and stores tenant-scoped
    authorization.
-   `Box` --- a discussion context associated with a site/page.
-   `Comment` --- discussion content, including threaded replies.
-   `SiteRule` --- site-specific discussion/moderation rules.
-   `CommentReport` --- reports submitted against comments.
-   `MuteRecord` --- moderation state for muted members.

### Authorization model

Site membership is modeled separately from authentication. Site-level
roles include:

-   `USER`
-   `MODERATOR`
-   `OWNER`

This lets ChatterBox answer two different questions independently:

1.  **Who is this person?** --- OIDC / Keycloak / Spring Security.
2.  **What may this person do on this site?** --- `SiteMember` and
    tenant-scoped RBAC.

## Authentication

ChatterBox uses **OpenID Connect (OIDC)** with Keycloak and Spring
Security.

The browser-facing application uses authenticated `OidcUser` principals
and secure cookie-backed sessions rather than storing bearer tokens in
browser storage. Keycloak provides identity infrastructure while
ChatterBox owns the application experience and authorization model.

> Current infrastructure work: hardening application startup so
> temporary identity-provider discovery failures do not unnecessarily
> prevent the ChatterBox API from becoming available.

## Embeddable Widget

A site owner embeds ChatterBox with a small JavaScript configuration
containing the registered site's identifier.

Conceptually:

``` html
<script>
  window.ChatterBoxConfig = {
    siteId: "YOUR_SITE_ID"
  };
</script>
<script src="https://your-chatterbox-widget.example/widget.js"></script>
```

The widget:

1.  Initializes against the ChatterBox API.
2.  Resolves the appropriate site/discussion context.
3.  Loads paginated comments.
4.  Renders inside a Shadow DOM boundary.
5.  Supports comment submission, replies, reactions, and authorized
    moderation behavior.

The Shadow DOM keeps ChatterBox styling isolated from the website
embedding it.

## Backend Capabilities

ChatterBox includes backend support for:

-   Site registration and onboarding
-   Tenant-aware membership and authorization
-   Threaded comments and replies
-   Comment pagination
-   Reactions
-   Comment reporting
-   Muting and unmuting
-   Pinning and moderation
-   Discussion locking
-   Site administration
-   Embeddable widget initialization
-   OIDC authentication
-   Redis-backed caching
-   PostgreSQL persistence

The backend exposes **15+ REST endpoints** across these workflows.

## Performance

One of the largest performance issues discovered during development was
in the authenticated comment-submission path.

After profiling the authentication/request flow and eliminating
redundant identity and request sequencing operations, comment submission
latency was reduced from approximately:

``` text
~30,000 ms  ->  ~200 ms
```

That is roughly a **99% reduction in observed latency**.

This optimization reinforced an important design principle behind the
project: ChatterBox is not only an API implementation exercise; it is an
attempt to reason about the behavior, failure modes, and performance
characteristics of a real multi-tenant backend.

## Technology Stack

### Backend

-   Java
-   Spring Boot
-   Spring Security
-   REST APIs
-   OIDC / OAuth 2.0

### Data & Infrastructure

-   PostgreSQL
-   Redis
-   Docker
-   Keycloak
-   Render

### Widget

-   JavaScript
-   Shadow DOM

## Running Locally

ChatterBox depends on PostgreSQL, Redis, and an OIDC provider. Configure
the application with the corresponding database, cache, and OAuth client
settings before starting the API.

Typical configuration includes values for:

``` text
DATABASE_URL
REDIS_HOST / REDIS_PORT
OIDC issuer URI
OAuth client ID
OAuth client secret
```

Exact environment-variable names may differ from the deployment
configuration in the repository.

Start the Spring Boot application using the project's configured build
tool, then serve or load the widget against the running API.

## Project Status

ChatterBox is under active development. The core multi-tenant commenting
architecture, authentication flow, site onboarding, widget integration,
RBAC, moderation workflows, and major backend functionality have been
implemented.

Current engineering work is focused on **resilience around the
authentication infrastructure**, particularly preventing temporary
Keycloak/OIDC discovery failures from taking down the entire API during
startup.

## Engineering Goals

ChatterBox is intentionally designed to explore backend problems that
appear in real SaaS systems:

-   Where should tenant boundaries live?
-   How should identity differ from authorization?
-   How do embedded applications authenticate securely?
-   How should role checks be enforced consistently?
-   What happens when an external identity dependency becomes
    unavailable?
-   How do request sequencing and authentication affect latency?
-   How should an embeddable product isolate itself from arbitrary host
    websites?

Those questions drive the architecture as much as the visible commenting
features do.
