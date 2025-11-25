"use client"

import { useState } from "react"
import { Bold, Italic, Underline, List, ListOrdered, Code, Heading2, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export default function TextEditor({
  value,
  onChange,
  placeholder = "Digite seu conteúdo aqui...",
  rows = 12,
}: TextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newValue)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const formatText = (action: string) => {
    switch (action) {
      case "bold":
        insertMarkdown("**", "**")
        break
      case "italic":
        insertMarkdown("*", "*")
        break
      case "underline":
        insertMarkdown("<u>", "</u>")
        break
      case "h2":
        insertMarkdown("\n## ", "\n")
        break
      case "code":
        insertMarkdown("`", "`")
        break
      case "link":
        insertMarkdown("[", "](https://)")
        break
      case "ul":
        insertMarkdown("\n- ", "")
        break
      case "ol":
        insertMarkdown("\n1. ", "")
        break
    }
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-1 flex-wrap bg-muted p-2 rounded-t-lg border border-b-0">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => formatText("bold")}
          title="Negrito (Ctrl+B)"
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => formatText("italic")}
          title="Itálico (Ctrl+I)"
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => formatText("underline")}
          title="Sublinhado (Ctrl+U)"
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px bg-border"></div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => formatText("h2")}
          title="Subtítulo"
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="w-px bg-border"></div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => formatText("ul")}
          title="Lista"
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => formatText("ol")}
          title="Lista numerada"
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => formatText("code")}
          title="Código"
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => formatText("link")}
          title="Link"
          className="h-8 w-8 p-0"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <div className="w-px bg-border"></div>
        <Button
          type="button"
          size="sm"
          variant={isPreview ? "default" : "ghost"}
          onClick={() => setIsPreview(!isPreview)}
          className="h-8 text-xs"
        >
          {isPreview ? "Editar" : "Visualizar"}
        </Button>
      </div>

      {isPreview ? (
        <div className="min-h-80 p-4 border rounded-b-lg bg-card prose prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: value
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em>$1</em>")
                .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
                .replace(/## (.*?)\n/g, "<h2>$1</h2>")
                .replace(/- (.*?)\n/g, "<li>$1</li>")
                .replace(/<li>/g, "<ul><li>")
                .replace(/<\/li>/g, "</li></ul>")
                .replace(/1\. (.*?)\n/g, "<ol><li>$1</li></ol>")
                .replace(/`(.*?)`/g, "<code>$1</code>")
                .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2">$1</a>')
                .replace(/\n/g, "<br/>"),
            }}
          />
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="font-mono rounded-b-lg rounded-t-none border-t-0"
        />
      )}
    </div>
  )
}
