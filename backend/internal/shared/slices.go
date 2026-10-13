// Package shared holds tiny helpers used across layers.
package shared

// Map applies fn to every item and returns the results.
func Map[T, U any](items []T, fn func(T) U) []U {
	out := make([]U, len(items))
	for i, item := range items {
		out[i] = fn(item)
	}
	return out
}
