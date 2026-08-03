# AI Pipeline Architecture

1. **Rule-based Pre-extraction**: Hybrid keyword scanning matches canonical keywords in student input.
2. **LLM Concept Extraction**: Grok-3 model parses freeform responses into structured concepts with evidence quotes and confidence levels.
3. **Graph Diffing**: Compare extracted concepts against required topic concepts to identify missing, weak, and known concepts.
4. **Misconception Detection**: Trigger phrases activate candidate checks, validated via LLM verification.
5. **Scoring & Path Generation**: Multidimensional scoring (Coverage, Depth, Accuracy, Connectivity) and topological sorting for recommended next concepts.
