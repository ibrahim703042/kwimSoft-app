import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/core/auth";
import { AlertCircle, CheckCircle2, XCircle, LogOut, Home } from "lucide-react";

export default function DiagnosticPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [localStorageData, setLocalStorageData] = useState<any>({});

  useEffect(() => {
    // Read all localStorage data
    const data: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key);
      }
    }
    setLocalStorageData(data);
  }, []);

  const clearAllData = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔍 Authentication Diagnostic
          </h1>

          {/* Auth Status */}
          <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <div className="flex items-center gap-3 mb-4">
              {isAuthenticated ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Authentication Status: {isAuthenticated ? "LOGGED IN" : "NOT LOGGED IN"}
                </h2>
                {isAuthenticated && user && (
                  <p className="text-sm text-gray-600 mt-1">
                    User: {user.username || user.email} ({user.firstName} {user.lastName})
                  </p>
                )}
              </div>
            </div>

            {isAuthenticated && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <strong>Why you're seeing dashboard:</strong> You have valid authentication tokens stored. 
                  The app considers you logged in.
                </div>
              </div>
            )}
          </div>

          {/* LocalStorage Data */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📦 LocalStorage Contents
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-auto max-h-96">
              {Object.keys(localStorageData).length === 0 ? (
                <p className="text-gray-500">localStorage is empty</p>
              ) : (
                <pre className="text-gray-700">
                  {JSON.stringify(localStorageData, null, 2)}
                </pre>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">🔧 Actions</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={clearAllData}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all"
              >
                <XCircle className="w-5 h-5" />
                Clear All Data & Reload
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Logout Properly
                </button>
              )}

              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all"
              >
                <Home className="w-5 h-5" />
                Go to Landing Page
              </button>

              <button
                onClick={() => navigate("/console")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-semibold text-blue-900 mb-2">💡 How to Fix</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li>1. If you see "LOGGED IN" above, click <strong>"Clear All Data & Reload"</strong></li>
              <li>2. The page will refresh and show the landing page</li>
              <li>3. If issue persists, open console (F12) and run: <code className="bg-blue-100 px-2 py-1 rounded">localStorage.clear(); location.reload();</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
