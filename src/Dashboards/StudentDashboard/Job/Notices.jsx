import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@headlessui/react";
import { useParams } from "react-router-dom";
import {
  fetchNotices,
  markNoticeAsRead,
} from "../../../Redux/StudentDashboard/noticeSlice";
import {
  Bell,
  Calendar,
  Clock
} from 'lucide-react';

const priorityColors = {
  High: "bg-red-500",
  Medium: "bg-yellow-400",
  Low: "bg-green-500",
};

const priorityBadgeColors = {
  High: "bg-red-100 text-red-800 border-red-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Low: "bg-green-100 text-green-800 border-green-200",
};

const ManageNotice = ({ setUnreadCount }) => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const [viewNotice, setViewNotice] = useState(null);
  const [filter, setFilter] = useState("all");

  const { notices, loading, error, markingReadIds } = useSelector(
    (state) => state.notice
  );

  const loadNotices = () => {
    dispatch(fetchNotices({ universityName }));
  };

  useEffect(() => {
    loadNotices();
  }, [universityName]);

  useEffect(() => {
    const unread = notices.filter((n) => !n.isRead).length;
    setUnreadCount(unread);
  }, [notices, setUnreadCount]);

  const handleView = (notice) => {
    setViewNotice(notice);
    if (!notice.isRead) {
      dispatch(markNoticeAsRead({ noticeId: notice._id, universityName }));
    }
  };

  const getFilteredNotices = () => {
    if (filter === "read") return notices.filter((n) => n.isRead);
    if (filter === "unread") return notices.filter((n) => !n.isRead);
    return notices;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center">
          <Bell className="w-8 h-8 text-blue-600 mr-2" /> Notice Board
        </h2>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow">
          <div className="text-center">
            <div className="font-bold text-xl">{notices.filter(n => !n.isRead).length}</div>
            <div className="text-xs">Unread</div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        {["all", "unread", "read"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded text-sm font-semibold ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Notices List */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full" />
        </div>
      ) : getFilteredNotices().length === 0 ? (
        <p className="text-center text-gray-500">No {filter} notices available</p>
      ) : (
        <ul className="space-y-4">
          {getFilteredNotices().map((notice, index) => (
            <li
              key={notice._id}
              className={`bg-white rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 overflow-hidden ${
                notice.isRead ? "border-gray-200" : "border-blue-200 bg-blue-50/30"
              }`}
            >
              <div className="flex">
                <div className={`w-2 ${priorityColors[notice.priority] || "bg-gray-300"}`} />

                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        {index + 1}. {notice.title}
                        {!notice.isRead && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        )}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Posted: {new Date(notice.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Expires: {new Date(notice.expiryDate).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4 line-clamp-2">
                        {notice.message}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full border text-sm font-medium ${
                        priorityBadgeColors[notice.priority] || "border-gray-200"
                      }`}
                    >
                      {notice.priority}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleView(notice)}
                      disabled={markingReadIds.includes(notice._id)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {markingReadIds.includes(notice._id) ? "Marking..." : "View Details"}
                    </button>
                    {!notice.isRead && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Notice Modal */}
      <Dialog
        open={!!viewNotice}
        onClose={() => setViewNotice(null)}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-50"
      >
        <Dialog.Panel className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
            <h2 className="text-2xl font-bold">{viewNotice?.title}</h2>
            <div className="flex items-center space-x-4 text-sm mt-2 text-blue-100">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Posted: {new Date(viewNotice?.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Expires: {new Date(viewNotice?.expiryDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="p-6 overflow-y-auto max-h-80">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{viewNotice?.message}</p>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex justify-end">
            <button
              onClick={() => setViewNotice(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default ManageNotice;