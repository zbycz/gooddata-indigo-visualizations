%global gdc_prefix /var/www/doc

%define _builddir %(pwd)

%define _rpmfilename %{NAME}-%{VERSION}-%{RELEASE}.%{ARCH}.rpm

# Release tag updates
%define branchname "%{?branch:%(echo %{branch} |sed 's/\.//')}%{!?branch:snapshot}"

Name: gdc-indigo-visualizations-web
Version: %{_version}
Release: %{_release}
Summary: GDC Indigo Visualizations Web

Group: Applications/Productivity
License: Proprietary
URL: http://gooddata.com/
BuildArch: noarch

BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)

BuildRequires: npm

%description
%{summary}

%prep

%build
. ci/lib.sh
grunt web

%install
rm -rf $RPM_BUILD_ROOT

mkdir -p $RPM_BUILD_ROOT%{gdc_prefix}/indigo-visualizations
cp -a web/* $RPM_BUILD_ROOT%{gdc_prefix}/indigo-visualizations/

%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(0644,root,root,0755)
%dir %{gdc_prefix}/indigo-visualizations
%{gdc_prefix}/indigo-visualizations/*

%changelog
