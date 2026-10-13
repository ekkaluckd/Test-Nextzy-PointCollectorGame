// Package docs serves the OpenAPI spec and an interactive Swagger UI.
package docs

import (
	"embed"
	"net/http"
)

//go:embed index.html openapi.yaml
var files embed.FS

func Handler() http.Handler {
	return http.FileServerFS(files)
}
