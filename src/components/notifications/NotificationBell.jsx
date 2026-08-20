import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCheckCircle,
  FaCommentDots,
  FaLeaf,
  FaPaperPlane,
} from "react-icons/fa";
import IconButton from "../button/IconButton";
import Button from "../button/Button";
import {
  notificationTimestampToDate,
  subscribeToUserNotifications,
} from "../../services/notificationService";
import "./notificationBell.css";

const notificationIcons = {
  invite: FaPaperPlane,
  accepted: FaCheckCircle,
  approved: FaLeaf,
  message: FaCommentDots,
};

function getStoredReadIds(storageKey) {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function formatNotificationDate(timestamp) {
  const date = notificationTimestampToDate(timestamp);
  if (!date) return "Agora";

  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
}

export default function NotificationBell({ userId, onOpen }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const storageKey = `recicla-notifications-read-${userId}`;
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => getStoredReadIds(storageKey));
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setReadIds(getStoredReadIds(storageKey));
  }, [storageKey]);

  useEffect(() => {
    setLoading(true);
    setHasError(false);

    const unsubscribe = subscribeToUserNotifications(
      userId,
      (items) => {
        setNotifications(items);
        setLoading(false);
      },
      () => {
        setHasError(true);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const readIdSet = useMemo(() => new Set(readIds), [readIds]);
  const unreadCount = notifications.filter(
    (notification) => !readIdSet.has(notification.id)
  ).length;

  function saveReadIds(nextIds) {
    const uniqueIds = Array.from(new Set(nextIds)).slice(-200);
    setReadIds(uniqueIds);
    try {
      localStorage.setItem(storageKey, JSON.stringify(uniqueIds));
    } catch {
      // A interface continua funcional mesmo se o navegador bloquear o armazenamento local.
    }
  }

  function markAsRead(notificationId) {
    if (readIdSet.has(notificationId)) return;
    saveReadIds([...readIds, notificationId]);
  }

  function markAllAsRead() {
    saveReadIds([...readIds, ...notifications.map((item) => item.id)]);
  }

  function openNotification(notification) {
    markAsRead(notification.id);
    setIsOpen(false);
    navigate(notification.to);
  }

  function togglePanel() {
    setIsOpen((current) => {
      const next = !current;
      if (next) onOpen?.();
      return next;
    });
  }

  return (
    <div className="notification-center" ref={containerRef}>
      <IconButton
        className="notification-bell-button"
        label={
          unreadCount
            ? `Notificações: ${unreadCount} não ${unreadCount === 1 ? "lida" : "lidas"}`
            : "Notificações"
        }
        title="Notificações"
        pressed={isOpen}
        onClick={togglePanel}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </IconButton>

      {isOpen && (
        <section
          className="notification-panel"
          role="dialog"
          aria-label="Notificações"
        >
          <header className="notification-panel-header">
            <div>
              <span>Atualizações</span>
              <h2>Notificações</h2>
            </div>
            {unreadCount > 0 && (
              <Button
                type="button"
                variant="neutral"
                className="notification-mark-all"
                onClick={markAllAsRead}
              >
                Marcar como lidas
              </Button>
            )}
          </header>

          <div className="notification-list">
            {loading && (
              <p className="notification-state">Carregando notificações...</p>
            )}

            {!loading && !hasError && notifications.length === 0 && (
              <div className="notification-empty">
                <FaBell />
                <strong>Tudo acompanhado por aqui</strong>
                <p>Novos convites, mensagens e aprovações aparecerão neste espaço.</p>
              </div>
            )}

            {!loading && hasError && notifications.length === 0 && (
              <p className="notification-state is-error">
                Não foi possível carregar as notificações agora.
              </p>
            )}

            {notifications.slice(0, 12).map((notification) => {
              const Icon = notificationIcons[notification.type] || FaBell;
              const isUnread = !readIdSet.has(notification.id);

              return (
                <button
                  type="button"
                  className={`notification-item ${isUnread ? "is-unread" : ""}`}
                  key={notification.id}
                  onClick={() => openNotification(notification)}
                >
                  <span className={`notification-item-icon is-${notification.type}`}>
                    <Icon />
                  </span>
                  <span className="notification-item-copy">
                    <strong>{notification.title}</strong>
                    <span>{notification.message}</span>
                    <time>{formatNotificationDate(notification.timestamp)}</time>
                  </span>
                  {isUnread && <span className="notification-unread-dot" />}
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
