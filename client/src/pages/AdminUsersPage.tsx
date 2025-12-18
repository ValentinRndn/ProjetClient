import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router";
import { listUsers, deleteUser, updateUserRole, type User, type UsersListResponse } from "@/services/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Users, UserCheck, Building2, Shield, ArrowLeft, Trash2, Edit2 } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/hooks/useAuth";

export default function AdminUsersPage() {
  const { user, isLoading: authLoading } = useAuth();

  const [usersData, setUsersData] = useState<UsersListResponse>({
    total: 0,
    items: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery, selectedRole]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await listUsers({
        take: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
        q: searchQuery || undefined,
        role: selectedRole !== "all" ? selectedRole : undefined,
      });
      setUsersData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des utilisateurs";
      setError(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteUser(id);
      setConfirmDeleteId(null);
      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suppression";
      setError(errorMessage);
      console.error("Error deleting user:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRoleChange = async (id: string, newRole: "ADMIN" | "ECOLE" | "INTERVENANT") => {
    try {
      setUpdatingRoleId(id);
      await updateUserRole(id, newRole);
      setEditingRoleId(null);
      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du changement de rôle";
      setError(errorMessage);
      console.error("Error updating user role:", err);
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-5 h-5 text-red-600" />;
      case "ECOLE":
        return <Building2 className="w-5 h-5 text-blue-600" />;
      case "INTERVENANT":
        return <UserCheck className="w-5 h-5" style={{ color: "#6d74b5" }} />;
      default:
        return <Users className="w-5 h-5" style={{ color: "#6d74b5" }} />;
    }
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      ADMIN: { bg: "#fef2f2", text: "#b91c1c" },
      ECOLE: { bg: "#eff6ff", text: "#1d4ed8" },
      INTERVENANT: { bg: "#ebf2fa", text: "#6d74b5" },
    };
    const style = styles[role] || { bg: "#ebf2fa", text: "#1c2942" };
    return (
      <span
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {getRoleIcon(role)}
        {role}
      </span>
    );
  };

  const totalPages = Math.ceil(usersData.total / itemsPerPage);

  // Protection supplémentaire : rediriger si pas admin
  if (!authLoading && user && user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  // Afficher un loader pendant la vérification d'authentification
  if (authLoading) {
    return (
      <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }} className="flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#ebf2fa", borderTopColor: "#1c2942" }}
          />
          <p style={{ color: "#6d74b5" }}>Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  const adminCount = usersData.items.filter((u) => u.role === "ADMIN").length;
  const ecoleCount = usersData.items.filter((u) => u.role === "ECOLE").length;
  const intervenantCount = usersData.items.filter((u) => u.role === "INTERVENANT").length;

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header compact */}
      <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/dashboard/admin"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#6d74b5" }}
            >
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Gestion des Utilisateurs</h1>
              <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                Consultez et gérez tous les utilisateurs de la plateforme
              </p>
            </div>
          </div>

          {/* Stats inline */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20">
            {[
              { value: usersData.total, label: "Total" },
              { value: adminCount, label: "Admins", highlight: true },
              { value: ecoleCount, label: "Écoles" },
              { value: intervenantCount, label: "Intervenants" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: stat.highlight ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.1)" }}
              >
                <span
                  className="font-bold"
                  style={{ color: stat.highlight ? "#fca5a5" : "#ffffff" }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-sm ml-2"
                  style={{ color: stat.highlight ? "#fca5a5" : "rgba(235, 242, 250, 0.7)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {/* Filtres et recherche */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "#6d74b5" }}
              />
              <Input
                type="text"
                placeholder="Rechercher par email ou nom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
                style={{ borderColor: "#ebf2fa" }}
              />
            </div>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{ borderColor: "#ebf2fa" }}
            >
              <option value="all">Tous les rôles</option>
              <option value="ADMIN">Admin</option>
              <option value="ECOLE">École</option>
              <option value="INTERVENANT">Intervenant</option>
            </Select>
            <Button
              variant="primary"
              onClick={handleSearch}
              className="w-full md:w-auto bg-[#6d74b5] hover:bg-[#5a61a0]"
            >
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        {isLoading ? (
          <div
            className="rounded-xl p-12 text-center"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: "#ebf2fa", borderTopColor: "#6d74b5" }}
            />
            <p style={{ color: "#6d74b5" }}>Chargement des utilisateurs...</p>
          </div>
        ) : usersData.items.length === 0 ? (
          <div
            className="rounded-xl p-12 text-center"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#ebf2fa" }}
            >
              <Users className="w-10 h-10" style={{ color: "#6d74b5" }} />
            </div>
            <p className="text-lg font-medium" style={{ color: "#1c2942" }}>
              Aucun utilisateur trouvé
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {usersData.items.map((userItem) => {
                const isCurrentUser = userItem.id === user?.id;

                return (
                  <div
                    key={userItem.id}
                    className="rounded-xl p-6"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "#ebf2fa" }}
                        >
                          {getRoleIcon(userItem.role)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold truncate" style={{ color: "#1c2942" }}>
                              {userItem.name || userItem.email.split("@")[0]}
                            </h3>
                            {editingRoleId === userItem.id ? (
                              <div className="flex items-center gap-2">
                                <Select
                                  value={userItem.role}
                                  onChange={(e) => handleRoleChange(userItem.id, e.target.value as "ADMIN" | "ECOLE" | "INTERVENANT")}
                                  disabled={updatingRoleId === userItem.id}
                                  className="text-xs py-1"
                                  style={{ borderColor: "#ebf2fa" }}
                                >
                                  <option value="ADMIN">Admin</option>
                                  <option value="ECOLE">École</option>
                                  <option value="INTERVENANT">Intervenant</option>
                                </Select>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setEditingRoleId(null)}
                                  disabled={updatingRoleId === userItem.id}
                                  style={{ borderColor: "#ebf2fa" }}
                                >
                                  Annuler
                                </Button>
                              </div>
                            ) : (
                              getRoleBadge(userItem.role)
                            )}
                            {isCurrentUser && (
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#d1fae5", color: "#065f46" }}>
                                Vous
                              </span>
                            )}
                          </div>
                          <p className="text-sm truncate" style={{ color: "#6d74b5" }}>{userItem.email}</p>
                          <p className="text-xs mt-1" style={{ color: "#6d74b5" }}>
                            Inscrit le {new Date(userItem.createdAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      {!isCurrentUser && (
                        <div className="flex items-center gap-2 shrink-0">
                          {editingRoleId !== userItem.id && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setEditingRoleId(userItem.id)}
                              style={{ borderColor: "#ebf2fa" }}
                              title="Modifier le rôle"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                          {confirmDeleteId === userItem.id ? (
                            <div className="flex gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleDelete(userItem.id)}
                                disabled={deletingId === userItem.id}
                                isLoading={deletingId === userItem.id}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Confirmer
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setConfirmDeleteId(null)}
                                disabled={deletingId === userItem.id}
                                style={{ borderColor: "#ebf2fa" }}
                              >
                                Annuler
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setConfirmDeleteId(userItem.id)}
                              className="text-red-500 hover:bg-red-50"
                              style={{ borderColor: "#ebf2fa" }}
                              title="Supprimer l'utilisateur"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{ borderColor: "#ebf2fa" }}
                >
                  Précédent
                </Button>
                <span className="text-sm" style={{ color: "#6d74b5" }}>
                  Page {currentPage} sur {totalPages}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{ borderColor: "#ebf2fa" }}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
