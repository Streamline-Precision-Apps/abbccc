"use client";
import { Button } from "@/components/ui/button";
import { use } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormStatus } from "@/lib/enums";
import { ExportModal } from "../_components/List/exportModal";
import EditFormSubmissionModal from "./_component/editFormSubmissionModal";
import CreateFormSubmissionModal from "./_component/CreateFormSubmissionModal";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Spinner from "@/components/(animations)/spinner";
import useSubmissionDataById from "./_component/hooks/useSubmissionDataById";
import RenderTableSection from "./_component/renderTableSection";
import RenderTitleDescriptionStatus from "./_component/RenderTitleDescriptionStatus";
import RenderButtonsAndFilters from "./_component/RenderButtonsAndFilters";
import { FooterPagination } from "../../_pages/FooterPagination";

interface PageProps {
  params: Promise<{ id: string }>;
}

const FormPage = ({ params }: PageProps) => {
  const { id } = use(params);
  const {
    inputValue,
    setInputValue,
    page,
    setPage,
    pageSize,
    setPageSize,
    dateRange,
    setDateRange,
    statusFilter,
    setStatusFilter,
    showExportModal,
    setShowExportModal,
    exportDateRange,
    setExportDateRange,
    showDeleteSubmissionDialog,
    setShowDeleteSubmissionDialog,
    showCreateModal,
    setShowCreateModal,
    formTemplate,
    loading,
    showDeleteDialog,
    setShowDeleteDialog,
    actionLoading,
    statusPopoverOpen,
    setStatusPopoverOpen,
    showFormSubmission,
    setShowFormSubmission,
    selectedSubmissionId,
    setSelectedSubmissionId,
    setRefreshKey,
    STATUS_OPTIONS,
    currentStatus,
    openHandleDelete,
    confirmDelete,
    cancelDelete,
    openHandleDeleteSubmission,
    confirmSubmissionDelete,
    cancelSubmissionDelete,
    triggerRerender,
    handleStatusChange,
    handleExport,
  } = useSubmissionDataById(id);
  const router = useRouter();

  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-5">
      <RenderTitleDescriptionStatus
        formTemplate={formTemplate}
        loading={loading}
        setStatusPopoverOpen={setStatusPopoverOpen}
        handleStatusChange={handleStatusChange}
        setRefreshKey={setRefreshKey}
        actionLoading={actionLoading}
        statusPopoverOpen={statusPopoverOpen}
        currentStatus={currentStatus}
        STATUS_OPTIONS={STATUS_OPTIONS}
      />
      <RenderButtonsAndFilters
        setShowExportModal={setShowExportModal}
        openHandleDelete={openHandleDelete}
        formTemplate={formTemplate}
        setShowCreateModal={setShowCreateModal}
        router={router}
        inputValue={inputValue}
        setInputValue={setInputValue}
        dateRange={dateRange}
        setDateRange={setDateRange}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        FormStatus={FormStatus}
      />

      <div className="h-[85vh] rounded-lg  w-full relative bg-white">
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center bg-white bg-opacity-70 rounded-lg">
            <Spinner size={20} />
            <span className="text-lg text-gray-500">Loading...</span>
          </div>
        )}
        <ScrollArea
          alwaysVisible
          className="h-[80vh] w-full  bg-white rounded-t-lg  border border-slate-200 relative pr-2"
        >
          <RenderTableSection
            formTemplate={formTemplate}
            loading={loading}
            inputValue={inputValue}
            setShowFormSubmission={setShowFormSubmission}
            setSelectedSubmissionId={setSelectedSubmissionId}
            openHandleDeleteSubmission={openHandleDeleteSubmission}
            page={page}
            setPage={setPage}
            setPageSize={setPageSize}
            pageSize={pageSize}
          />
          <div className="h-1 bg-slate-100 border-y border-slate-200 absolute bottom-0 right-0 left-0">
            <ScrollBar
              orientation="horizontal"
              className="w-full h-3 ml-2 mr-2 rounded-full"
            />
          </div>
        </ScrollArea>
        {formTemplate && (
          <FooterPagination
            page={page}
            totalPages={formTemplate.totalPages}
            total={formTemplate.total}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        )}
      </div>
      {/* Create Section Modal */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form Template?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this form template? All form data
              will be permanently deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Submission Confirmation Dialog */}
      <Dialog
        open={showDeleteSubmissionDialog}
        onOpenChange={setShowDeleteSubmissionDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form Submission?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this form submission? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelSubmissionDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmSubmissionDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {showExportModal && (
        <ExportModal
          setDateRange={setExportDateRange}
          dateRange={exportDateRange}
          onClose={() => {
            setShowExportModal(false);
          }}
          onExport={handleExport}
        />
      )}
      {showCreateModal && formTemplate && (
        <CreateFormSubmissionModal
          formTemplate={formTemplate}
          closeModal={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            triggerRerender();
          }}
        />
      )}
      {showFormSubmission && selectedSubmissionId && formTemplate && (
        <EditFormSubmissionModal
          id={selectedSubmissionId}
          formTemplate={formTemplate}
          closeModal={() => setShowFormSubmission(false)}
          onSuccess={() => {
            setShowFormSubmission(false);
            triggerRerender();
          }}
        />
      )}
    </div>
  );
};

export default FormPage;
