class Editor {
  private text: string = '';
  private cursorX: number = 0;
  private cursorY: number = 0;

  setText(text: string): void {
    this.text = text;
  }

  getText(): string {
    return this.text;
  }

  setCursor(x: number, y: number): void {
    this.cursorX = x;
    this.cursorY = y;
  }

  getCursor(): [number, number] {
    return [this.cursorX, this.cursorY];
  }

  createSnapshot(): EditorSnapshot {
    return new EditorSnapshot(this, this.text, this.cursorX, this.cursorY);
  }
}

class EditorSnapshot {
  constructor(
    private editor: Editor,
    private text: string,
    private cursorX: number,
    private cursorY: number
  ) {}

  restore(): void {
    this.editor.setText(this.text);
    this.editor.setCursor(this.cursorX, this.cursorY);
  }
}

class EditorUI {
  editor: Editor = new Editor();
  private backup: EditorSnapshot | null = null;

  changeText(text: string, cursorX: number, cursorY: number): void {
    this.backup = this.editor.createSnapshot();
    this.editor.setText(text);
    this.editor.setCursor(cursorX, cursorY);
  }

  undo(): void {
    if (!this.backup) return;
    this.backup.restore();
  }
}

const editorUI = new EditorUI();

editorUI.changeText('Hello', 1, 1);
console.log(editorUI.editor.getText(), editorUI.editor.getCursor());

editorUI.changeText('Hello World', 1, 2);
console.log(editorUI.editor.getText(), editorUI.editor.getCursor());

editorUI.undo();
console.log(editorUI.editor.getText(), editorUI.editor.getCursor());
