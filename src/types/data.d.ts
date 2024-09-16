type Notebook = {
    id: number;
    userId: number;
    name: string;
    description: string;
    emoji: string;
    heroImage: string | null;
    createdAt: Date;
    updatedAt: Date;
}

type Note = {
    id: number;
    notebookId: number;
    name: string;
    emojiId: string;
    isPinned: boolean;
    isArchived: boolean;
    updatedAt : string;
    tags: Tag[]
    content : string
    Notebook : {
        id : number,
        emoji : string
        name : string
    }
}

type Content = {
    id: number;
    notesId: number;
    content: string;
}

type Tag = {
    id?: number;
    name: string;
}