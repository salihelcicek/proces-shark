"use client";

import { useEffect, useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRealtimeUpdates } from "@/lib/realtime2";
import {
  addComment as createComment,
  updateComment,
  deleteComment,
} from "@/lib/db/comments";
import { toast } from "sonner";
import { Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { enrichCommentsWithUsers } from "@/lib/helpers/enrichComments";

export default function CommentSection({ blogId, user }) {
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);

  const textareaRef = useRef(null); // ✅ Burada tanımla

  const liveComments = useRealtimeUpdates("comments", blogId, "blog_id");

  useEffect(() => {
    async function enrich() {
      const enriched = await enrichCommentsWithUsers(liveComments);
      setComments(enriched);
    }
    enrich();
  }, [liveComments]);

  const handleSubmit = async () => {
    if (!user || !commentText.trim()) return;

    if (editingId) {
      await updateComment(editingId, commentText);
      toast.success("Yorum güncellendi!");
      setEditingId(null);
    } else {
      await createComment(blogId, user.id, commentText, replyTo);
      toast.success("Yorum eklendi!");
    }

    setCommentText("");
    setReplyTo(null);
  };

  const handleEdit = (id, text) => {
    setEditingId(id);
    setCommentText(text);
    textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); // ⬅️ scroll ekledik
  };
  

  const handleDelete = async (id) => {
    if (confirm("Yorumu silmek istediğine emin misin?")) {
      await deleteComment(id);
      toast.success("Yorum silindi.");
    }
  };

  const rootComments = comments.filter((c) => !c.parent_id);
  const replies = (parentId) =>
    comments.filter((c) => c.parent_id === parentId);

  return (
    <div className="mt-10 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">Yorumlar</h2>

      <div className="space-y-6">
        {rootComments.map((comment) => (
          <div key={comment.id}>
            <CommentCard
              comment={comment}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReply={(id) => {
                setReplyTo(id);
                textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            />
            <div className="pl-6 mt-2 space-y-4">
              {replies(comment.id).map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  user={user}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isReply
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        {replyTo && (
          <div className="text-sm text-muted-foreground mb-2">
            Yanıtlanıyor:{" "}
            <span className="font-medium">
              {comments.find((c) => c.id === replyTo)?.user?.email || "Yorum"}
            </span>
            <button
              onClick={() => setReplyTo(null)}
              className="ml-2 text-xs text-red-500 hover:underline"
            >
              Vazgeç
            </button>
          </div>
        )}

        <Textarea
          ref={textareaRef} // ✅ Scroll buraya odaklanacak
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Yorumunuzu yazın..."
        />
        <Button onClick={handleSubmit} className="mt-2">
          {editingId ? "Yorumu Güncelle" : "Yorum Ekle"}
        </Button>
      </div>
    </div>
  );
}

function CommentCard({ comment, user, onEdit, onDelete, onReply, isReply = false }) {
  return (
    <div
      className={`border p-4 rounded-md bg-muted/30 relative ${
        isReply ? "bg-muted/10" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        {comment.user?.profile_image && (
          <Image
            src={comment.user.profile_image}
            alt="avatar"
            width={30}
            height={30}
            className="rounded-full"
          />
        )}
        <span className="text-sm text-muted-foreground font-semibold">
          {comment.user?.email || "Bilinmeyen Kullanıcı"}
        </span>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
        {comment.content}
      </p>

      <div className="mt-2 flex gap-2 text-sm text-muted-foreground">
        {user && onReply && (
          <button
            onClick={() => onReply(comment.id)}
            className="hover:text-sky-600 text-xs"
          >
            Yanıtla
          </button>
        )}
        {user?.id === comment.user_id && (
          <>
            <button
              onClick={() => onEdit(comment.id, comment.content)}
              className="hover:text-yellow-600"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
