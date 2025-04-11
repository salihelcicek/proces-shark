export interface User {
    id: string; // UUID
    email: string;
    username: string;
    profile_image: string | null;
    created_at: string; // or Date, depending on usage
  }
  
  
  export interface Comment {
    id: string;           // UUID
    blog_id: string;      // UUID of the related blog post
    user_id: string;      // UUID of the user who wrote the comment
    content: string;
    created_at: string;   // ISO timestamp or use `Date` if preferred
    parent_id?: string | null; // Nullable UUID for nested comments
  }
  